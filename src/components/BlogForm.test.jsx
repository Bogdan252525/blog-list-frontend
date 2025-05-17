import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls createBlog with correct details when submitted', async () => {
  const createBlog = vi.fn()
  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  const titleInput = screen.getByPlaceholderText('Enter blog title')
  const authorInput = screen.getByPlaceholderText('Enter author name')
  const urlInput = screen.getByPlaceholderText('Enter blog URL')  
  const submitButton = screen.getByText('create')

  await user.type(titleInput, 'Testing React Forms')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'http://example.com')
  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing React Forms',
    author: 'John Doe',
    url: 'http://example.com',
  })
})
