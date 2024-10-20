import { instrumentRepository } from '@/config/datasource';

interface SearchOptions {
  query: string;
  limit?: number;
  filter?: ('name' | 'ticker')[];
  page?: number;
}

export async function search(options: SearchOptions) {
  const { query, limit = 10, filter = ['name', 'ticker'], page = 0 } = options;

  const skip = page * limit;

  const builder = instrumentRepository.createQueryBuilder('instrument');

  filter.forEach((f) => {
    builder.orWhere(`LOWER(instrument.${f}) LIKE :q`, {
      q: `%${query.toLowerCase()}%`,
    });
  });

  builder.take(limit).skip(skip);

  builder.useTransaction(true);

  const [data, total] = await builder.getManyAndCount();

  const hasMore = total > limit + skip;

  return {
    data,
    info: {
      total,
      limit,
      page,
      nextPage: hasMore ? page + 1 : null,
      hasMore,
    },
  };
}

export * as InstrumentsService from './instruments';
