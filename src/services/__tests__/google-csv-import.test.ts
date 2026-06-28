import { parseGoogleCSV } from '../google-csv-import';

describe('parseGoogleCSV', () => {
  it('should parse a valid Google CSV with simple values', () => {
    const csv = `name,url,username,password,note
GitHub,https://github.com,user1,pass1,Note 1
Google,https://google.com,user2,pass2,Note 2`;
    const result = parseGoogleCSV(csv);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      website: 'GitHub',
      url: 'https://github.com',
      username: 'user1',
      password: 'pass1',
      notes: 'Note 1',
      category: 'Login',
    });
  });

  it('should handle quoted values containing commas', () => {
    const csv = `name,url,username,password,note
"Company, Inc",https://company.com,user,pass,"This is a note, with a comma"`;
    const result = parseGoogleCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].website).toBe('Company, Inc');
    expect(result[0].notes).toBe('This is a note, with a comma');
  });

  it('should skip empty lines and header', () => {
    const csv = `name,url,username,password,note

GitHub,https://github.com,user,pass,note

`;
    const result = parseGoogleCSV(csv);
    expect(result).toHaveLength(1);
  });

  it('should handle missing values', () => {
    const csv = `name,url,username,password,note
GitHub,,user,,`;
    const result = parseGoogleCSV(csv);
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('');
    expect(result[0].password).toBe('');
  });

  it('should return empty array for empty input', () => {
    expect(parseGoogleCSV('')).toEqual([]);
    expect(parseGoogleCSV('name,url,username,password,note')).toEqual([]);
  });
});
