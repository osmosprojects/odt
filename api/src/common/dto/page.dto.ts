export class PageDto<T> {
  readonly data: T[];
  readonly total: number;
  readonly page: number;
  readonly lastPage: number;

  constructor(data: T[], total: number, pageOptions: { page: number; limit: number }) {
    this.data = data;
    this.total = total;
    this.page = pageOptions.page;
    this.lastPage = Math.ceil(total / pageOptions.limit) || 1;
  }
}