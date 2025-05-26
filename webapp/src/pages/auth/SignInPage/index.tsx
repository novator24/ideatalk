import { zSignInTrpcInput } from '@ideanick/backend/src/router/auth/signIn/input'
import Cookies from 'js-cookie'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { mixpanelIdentify, mixpanelTrackSignIn } from '../../../lib/mixpanel'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const SignInPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign In',
})(() => {
  const trpcUtils = trpc.useContext()
  const signIn = trpc.signIn.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInTrpcInput,
    onSubmit: async (values) => {
      const { token, userId } = await signIn.mutateAsync(values)
      mixpanelIdentify(userId)
      mixpanelTrackSignIn()
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate()
    },
    resetOnSuccess: false,
  })

  return (
    <Segment title="Sign In">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Sign In</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
