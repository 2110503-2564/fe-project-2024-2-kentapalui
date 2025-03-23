interface Session {
  _id: string;
  company: Company;
  user: User;
  date: string;
}

interface GETAllSessionsResponse
  extends WithPagination,
    DefaultResponse<Array<Session>> {}

type GETSessionsByUserResponse = DefaultResponse<Array<Session>>;
