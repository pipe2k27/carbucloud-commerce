export type ServerResponse = {
  status: number;
  message?: string;
  data?: any;
};

export const errorObject: ServerResponse = {
  status: 500,
  message: "An error occurred",
};
