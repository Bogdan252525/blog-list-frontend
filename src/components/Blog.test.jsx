import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but hides URL and likes by default', () => {
  const blog = {
    title: 'React Testing',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 42,
    user: { username: 'johndoe' }
  }

  render(<Blog blog={blog} username="johndoe" addLike={() => {}} deleteBlog={() => {}} />)

  expect(screen.getByText((content) => content.includes('React Testing'))).toBeDefined()

  expect(screen.getByText((content) => content.includes('John Doe'))).toBeDefined()

  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText('42')).toBeNull()
})

test('after clicking view button, URL and likes are shown', async () => {
  const blog = {
    title: 'React Testing',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 42,
    user: { username: 'johndoe' }
  }

  render(<Blog blog={blog} username="johndoe" addLike={() => {}} deleteBlog={() => {}} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)

  expect(screen.getByText('http://example.com')).toBeDefined()
  expect(screen.getByText('42')).toBeDefined()
})

test('calls event handler twice when like button is clicked twice', async () => {
  const blog = {
    title: 'React Testing',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 42,
    user: { username: 'johndoe' }
  }

  const mockHandler = vi.fn()
  render(<Blog blog={blog} username="johndoe" addLike={mockHandler} deleteBlog={() => {}} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})
