import cn from 'classnames'
import css from './index.module.scss'

export const Loader = ({ type }: { type: 'page' | 'section' }) => (
  <span
    className={cn({
      [css.loader]: true,
      [css[`type-${type}`]]: true,
    })}
  />
)
