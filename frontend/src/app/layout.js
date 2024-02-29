import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/datatable.css';

export const metadata = {
    title: "User datatable"
}

export default function RootLayout({ children }) {
 return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
            </head>
            <body>
                {children}
                <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js'></script>
            </body>
        </html>
    )
}
