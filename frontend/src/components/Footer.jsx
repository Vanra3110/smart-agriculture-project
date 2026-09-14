function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

                    <div className="text-center sm:text-left">

                        <p className="font-semibold text-slate-900">
                            🌾 Smart Agriculture AI
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            AI-powered crop recommendation system
                        </p>

                    </div>

                    <p className="text-sm text-slate-400">
                        Built with React, Express, FastAPI & AI
                    </p>

                </div>

                <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                    <p className="text-xs leading-5 text-slate-400">
                        AI-generated recommendations are provided for
                        guidance and should not replace professional
                        agricultural advice.
                    </p>

                </div>

            </div>
        </footer>
    );
}

export default Footer;