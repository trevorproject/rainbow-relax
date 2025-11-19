import ReactGA from "react-ga4";

export type GAParams = Record<string, string | number | boolean | null | undefined>;

export function track(name: string, params: GAParams = {}){
    ReactGA.gtag("event", name), {
        ...params,
        transport_type: "beacon",
        debug_mode: true,
        event_callback: () => console.log("GA ACK:", name),
    };
}