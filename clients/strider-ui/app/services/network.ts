import Service from '@ember/service';
import fetch from 'fetch';

class ApiError extends Error {
  status: number;

  constructor(status: number, payload: Record<string, any>) {
    super();
    this.message = payload?.errors?.join(', ');
    this.status = status;
  }
}

export default class Network extends Service {
  headers(override?: Record<string, string>) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (override) {
      Object.assign(headers, override);
    }

    return headers;
  }

  async request(
    url: string,
    { headers }: { headers?: Record<string, string> } = {}
  ) {
    const response = await fetch(url, {
      headers: this.headers(headers),
    });

    return this.handleResponse(response);
  }

  async post(
    url: string,
    data: Record<string, unknown>,
    { headers }: { headers?: Record<string, string> } = {}
  ) {
    const response = await fetch(url, {
      method: 'post',
      headers: this.headers(headers),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      let json;

      try {
        json = await response.json();
      } catch (e) {
        json = { errors: [response.statusText] };
      }
      throw new ApiError(response.status, json);
    }

    const json = await response.json();

    return json;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    network: Network;
  }
}
