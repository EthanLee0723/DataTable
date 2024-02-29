import 'bootstrap/dist/css/bootstrap.css';
// import '/public/assets/css/dataTables.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
