export const BASE_URL = "http://127.0.0.1:3333/";

// export const BASE_URL = "https://6243-2a02-4780-28-a9a1-00-1.ngrok-free.app/";

export const API = {
  BASE_URL,
  LOGIN: BASE_URL + "api/v1/loginViaLicense",
  ASSET_UPLOAD: BASE_URL + "api/v1/asset/upload",
  ASSET_DELETE: BASE_URL + "api/v1/asset/remove",
  ADDRESS_API: (POST_CODE: string) =>
    `https://api.ideal-postcodes.co.uk/v1/postcodes/${encodeURI(
      POST_CODE
    )}?api_key=ak_lqnayxxif9QjEBCLbQzPh1CgWmghJ`,
};
