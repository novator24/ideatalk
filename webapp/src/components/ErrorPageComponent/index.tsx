import { Alert } from '../Alert'
import { Segment } from '../Segment'

export const ErrorPageComponent = ({
  title = 'Oops, error',
  message = 'Something went wrong',
  children,
}: {
  title?: string
  message?: string
  children?: React.ReactNode
}) => {
  return (
    <Segment title={title}>
      <Alert color="red">{message}</Alert>
      {children}
    </Segment>
  )
}
