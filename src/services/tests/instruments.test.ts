import { InstrumentsService } from '../instruments';

describe('search instruments', () => {
  test('should return a list of instruments that match the search query', async () => {
    const { data } = await InstrumentsService.search({
      query: 'a',
    });

    expect(data).toHaveLength(10);

    data.forEach((instrument) => {
      const nameMatch = instrument.name.toLowerCase().includes('a');

      const tickerMatch = instrument.ticker.toLowerCase().includes('a');

      expect(nameMatch || tickerMatch).toBe(true);
    });
  });
});
