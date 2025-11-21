import { useNavigate as useReactRouterNavigate, type To, type NavigateOptions } from "react-router-dom";
import { buildUrlWithParams } from "../utils/navigationHelpers";

export function useNavigateWithParams() {
  const navigate = useReactRouterNavigate();

  return (to: To, options?: NavigateOptions) => {
    if (typeof to === "string") {
      const urlWithParams = buildUrlWithParams(to);
      navigate(urlWithParams, options);
      return;
    }

    const urlWithParams = buildUrlWithParams(to.pathname ?? "/");
    const [pathname, search] = urlWithParams.split("?");

    navigate(
      {
        ...to,
        pathname,
        search: search ? `?${search}` : undefined,
      },
      options
    );
  };
}
