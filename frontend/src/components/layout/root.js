import { Outlet } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-[#0f0f0f] text-white py-2">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    Coded with <span className="text-red-500">&lt;3</span> by Kaliendo, available on{' '}
                    <a href="https://github.com/Kaliendo/aethernote" className="text-blue-400 underline">
                        GitHub
                    </a>.
                </p>
            </div>
        </footer>
    );
}

const RootLayout = () => {
    return (
        <div>
            <Outlet />
            <Footer />
        </div>
    );
}

export default RootLayout;