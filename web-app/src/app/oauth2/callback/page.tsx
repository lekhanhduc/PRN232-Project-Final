'"use client";'
import { useState } from "react";

const Oauth2CallBack = () => {

    const [error, setError] = useState<string | null>(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Callback Keycloak</h1>
            {error ? (
                <div className="text-red-600 mb-4">{error}</div>
            ) : (
                <p className="text-gray-600">Redirecting to application...</p>
            )}
        </div>
    );
}