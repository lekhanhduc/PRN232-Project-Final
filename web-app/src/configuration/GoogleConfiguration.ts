export const GoogleConfiguration = {
    client_id: process.env.GOOGLE_CLIENT_ID || "441587123979-qds882ebt12bna4t4pldj9ausd2udpu2.apps.googleusercontent.com",
    response_type: process.env.GOOGLE_RESPONSE_TYPE || "code",
    scope: process.env.GOOGLE_SCOPE || "email%20profile%20openid",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "https://taycodejava.id.vn/oauth2/callback/google",
};