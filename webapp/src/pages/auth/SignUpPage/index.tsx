import { zSignUpTrpcInput } from '@ideanick/backend/src/router/auth/signUp/input'
import { zPasswordsMustBeTheSame, zStringRequired } from '@ideanick/shared/src/zod'
import Cookies from 'js-cookie'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { mixpanelAlias, mixpanelTrackSignUp } from '../../../lib/mixpanel'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const SignUpPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign Up',
})(() => {
  const trpcUtils = trpc.useContext()
  const signUp = trpc.signUp.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        passwordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('password', 'passwordAgain')),
    onSubmit: async (values) => {
      const { token, userId } = await signUp.mutateAsync(values)
      mixpanelAlias(userId)
      mixpanelTrackSignUp()
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate()
    },
    resetOnSuccess: false,
  })

  return (
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="E-mail" name="email" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          <Input label="Password again" name="passwordAgain" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
