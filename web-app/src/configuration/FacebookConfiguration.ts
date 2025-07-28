export const FacebookConfiguration = {
    client_id: "1727690964526245",
    response_type: "code",
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI || "https://taycodejava.id.vn/oauth2/callback/facebook",
    scope: "openid,public_profile,email",
};