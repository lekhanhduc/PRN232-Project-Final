export default function HomeContent() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div className="flex items-center justify-center">
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Our Application</h1>
                <p className="text-lg text-gray-600">
                    This is the home page of our application.
                </p>
            </div>
            <footer className="text-sm text-gray-500">
                © {new Date().getFullYear()} Your Company Name
            </footer>
        </div>
    );
}