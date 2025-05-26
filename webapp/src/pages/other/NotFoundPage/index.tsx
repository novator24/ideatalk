import image404 from '../../../assets/images/404.png'
import { ErrorPageComponent } from '../../../components/ErrorPageComponent'
import css from './index.module.scss'

export const NotFoundPage = ({
  title = 'Not Found',
  message = 'This page does not exist',
}: {
  title?: string
  message?: string
}) => (
  <ErrorPageComponent title={title} message={message}>
    <img src={image404} className={css.image} alt="" width="800" height="600" />
  </ErrorPageComponent>
)
