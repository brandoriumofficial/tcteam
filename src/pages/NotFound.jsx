// import React from 'react'

// export default function NotFound() {
//   return (
//     <>
//   <section className="page_error">
//     <div className="container">
//       <div className="row">
//         <div className="page_error_animation">
//           <h1>404</h1>
//         </div>
//       </div>
//     </div>
//   </section>
// </>

//   )
// }

import React from "react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">

        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Work is in Process 🚧
        </h2>

        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          This page is currently being built.  
          Please check back later or return to the homepage.
        </p>

        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
          >
            Go to Homepage
          </a>
        </div>

      </div>
    </section>
  );
}
