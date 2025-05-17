import { useState, useEffect } from 'react'

const Blog = ({ blog, addLike, deleteBlog, username }) => {
  const [getAllInformation, setGetAllInformation] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (username && blog.user?.username) {
      setIsOwner(username === blog.user.username)
    } else {
      console.log('Проблема з user:', blog.user)
    }
  }, [username, blog.user])

  const handleShowInformation = () => {
    setGetAllInformation(!getAllInformation)
  }

  console.log('isOwner значення:', isOwner)
console.log('username:', username)
console.log('blog.user.username:', blog.user?.username)


  return (
    <div className="blogStyle">
      <p>
        {blog.title} {blog.author}
        <button onClick={handleShowInformation}>
          {getAllInformation ? 'hide' : 'view'}
        </button>
      </p>
      {getAllInformation && (
        <>
          <p>{blog.url}</p>
          <p data-testid="likes-count">
            {blog.likes}
            <button onClick={() => addLike(blog.likes, blog.id)}>like</button>
          </p>
          <p>{blog.author}</p>
          {isOwner && (
            <button
              data-testid="remove-button"
              onClick={() => deleteBlog(blog.id, blog.author)}
            >
              remove
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
