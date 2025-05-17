import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        console.log(blogs)
        setBlogs(blogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }

    fetchBlogs()
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      if (!user || !user.token) {
        throw new Error('Invalid response from server')
      }

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('Login failed:', error.message || error)
      setErrorMessage('Wrong username or password')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    try {
      setUser(null)
      window.localStorage.removeItem('loggedBlogappUser')
      console.log(user)
    } catch (error) {
      console.log(error)
    }
  }

  const addLike = async (likesAmount, id) => {
    try {
      const returnedBlog = await blogService.put({ likes: likesAmount + 1 }, id)

      setBlogs(
        blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
      )
    } catch (error) {
      console.error('Failed to add like:', error)
    }
  }

  const deleteBlog = async (id, author) => {
    const confirmed = window.confirm(
      `Remove blog You're NOT gonna need it! ${author}`
    )

    if (!confirmed) {
      console.log('Action cancelled.')
      return
    }

    try {
      await blogService.deleteBlog(id)

      setBlogs(blogs.filter((blog) => blog.id !== id))
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      console.log('returnedBlog', returnedBlog);
      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog])

      setErrorMessage(`A new blog by ${user.username} added!`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      console.log('Error adding blog', error)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>login to application</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button
            className="loginButton"
            type="submit"
          >
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <p>{`${user.name} logged in`}</p>
      <button
        className="logoutButton"
        onClick={handleLogout}
      >
        logout
      </button>

      <Togglable
        buttonLabel="new blog"
        ref={blogFormRef}
      >
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            username={user.username}
            deleteBlog={deleteBlog}
            addLike={addLike}
            key={blog.id}
            blog={blog}
          />
        ))}
    </div>
  )
}

export default App
