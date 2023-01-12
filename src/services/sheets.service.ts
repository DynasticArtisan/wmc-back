import { GoogleSpreadsheet } from "google-spreadsheet";
const sheetId = "1Do3nX7TaL94nKo1O2R4p23knUqX7LISxxLhyNKjkQgs";
const credentials = {
  type: "service_account",
  project_id: "mart-table",
  private_key_id: "207414b64c74aea4a59bd07f13ea990ac840a385",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDqxYb2Okxq9lAu\nQeIKlvXrRynIcrua4RFq/GhNFplVmv2YgsLUfxEJZMOJ5HY9mdeGkUocgqk2jXtp\nWuLL+R8c4sKCaUYZTmQh72fMKZ8ThVjFlVPvE0tNZOHTIul2w8JZMNOkUqtKPsgN\nf7YBvauFHTe4yB3neQ/I9LlryxIXoCdA68HGFV4ysQeb8Mjo6oP9A9jfZxrDUKDr\nmUGcTDUwD+jv9Q7UnqRtXT+arjNfhOulbJwd2JgUiXNkdwS+19ZTlcUqq+YrssKg\nN34CERWyONYks5eNpCbWgbrDdYK2ucwDN9hsEg5gTwh526qGHWROQB2c2tFI0uIj\n33vDftRPAgMBAAECggEAP6keRqhaTmrKJTDyRWLX/luGpfcOjhnXqkYVVkn5fDAR\n8ggLIqnuCbkMGNkdguize6bsDL0Ve1h0DYZ6l0rPN/r5OXmoa3ZJSrZrU/45R4bS\nIomyf9KgibUAU0tVOUIt8hd+XEGadwB9KMPnq6Mt3mOk13NUQI8gS6KooOUo28Sp\nxCLfE7A8zjBIwHBZ7rW8gTyejTRbg3l3fqNaAzU1vTgmJY9zoE3sXcxqUFIsY173\nX/IR8j5tVfq9CRTtO7gWQjbnBt3HtCd6UZiSTwUPX/X4k6sRIaIBOKk4qDzZpc0k\n1uV0I4djJu/evWbPbJQI5eRp+BUc5GFzqyQZfIwOsQKBgQD6Zoennb7NC3194O/1\n2jAbVBiv95tVzOUJExcy0SFCkGLoaG7p6Qa/XrZTmqjnNVulU90SYO5JS1YeXVKW\nPUs46g09mghNer21l6Z7QI+VYcJzBCy0XFYDIZbI+HrH56i8xwg9IkJajdhVAj32\nbMsdOmSJVXP91Vms+TzFlF6YZwKBgQDwBYa622/mLr+eLQVtyTn3Y8yb2XMMziDf\nT1Ol+KDX0sYP9jxqCpYG20VSs1yvd+NeVXVK9EyLfB2bwu7PVJl6tH9HGo9c6M4B\nVcu+St8PKKtkRTGq3xdUJI3O9Cv71xufuLtL0EAOMo/5Ehe0xTcsjuBKs/IkUP8F\nA8099gAT2QKBgQCbZ7rVen+KfpEZ6NrEuO+WZnET9RaA/7M+GI0TStvblgTsvLPp\nlGhNqRh7dsdRB7qjNxNDbsk0z/7YxY6WE+B1qD0jeE+i1oSbCU2XvQ/f5FZsT7D3\nFz+CnfwZKq35F3uP/e7NElAgJ1yWFdgi8o50y2LOISzl4t3PDrh634R+DQKBgQCh\nveeblXHjeE8yBP6qi7ZfKkZgI3lvAJyQPwGMT2374hIMAY+Wmcmdlzcw0qM7rxtt\nn0LqHpRSTnIZW5PX7Rd745P9Uz2Wi17+8VTZx9Rmf653ZFVi4vDyh6tz8YCONdds\nm2zDWvM/Xf09B18oNtnGUgV88aPTqy0esQAmp9ZHiQKBgDrTWT577mh2ohF+QM7p\nWq8LuIHa/HCbaFDLUfDwHhwVQ6TNMH3MhM9l991t+SuJcan0Ofx0EriDjNbiPLzA\nlY5rmJtqTZuriPa2w8Z+6VIX6T1iuBmRx9wEYyxRRyzOyXPQz8zBaqz1gjXqPNNv\noFEH8nr5mABKhepeE3MaUoOb\n-----END PRIVATE KEY-----\n",
  client_email: "mart-testapi@mart-table.iam.gserviceaccount.com",
  client_id: "110338963247546204794",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/mart-testapi%40mart-table.iam.gserviceaccount.com",
};

class SheetsService {
  sheets;
  constructor() {
    this.sheets = new GoogleSpreadsheet(sheetId);
    this.sheets.useServiceAccountAuth(credentials);
  }

  async createOrder() {
    await this.sheets.loadInfo();
    const sheet = this.sheets.sheetsByIndex[0];
  }
}
export default new SheetsService();
