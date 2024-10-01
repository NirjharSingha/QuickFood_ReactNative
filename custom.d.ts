declare module "*.png" {
    const value: any;
    export default value;
}

declare module "*.jpg" {
    const value: any;
    export default value;
}

declare module "*.jpeg" {
    const value: any;
    export default value;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            EXPO_PUBLIC_EMAILJS_SERVICE_ID: string;
            EXPO_PUBLIC_EMAILJS_TEMPLATE_ID: string;
            EXPO_PUBLIC_EMAILJS_PUBLIC_KEY: string;
        }
    }
}