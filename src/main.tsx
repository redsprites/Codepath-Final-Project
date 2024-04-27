import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreatePost from './components/CreatePost.tsx'
import PostGallary from './components/PostGallary.tsx'
import PostEdit from './components/PostEdit.tsx'
import PostDetails from './components/PostDetails.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<App />} />
          <Route path="/create" element={<CreatePost/>} />
          <Route path="/gallary" element={<PostGallary/>} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
