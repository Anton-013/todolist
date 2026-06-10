import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { useLoginMutation } from "@/features/auth/api/authApi"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { useState } from "react"
import { useGetCaptchaUrlQuery } from "@/features/captcha/api/captchaApi"
import { IconButton, InputAdornment } from "@mui/material"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const [showCaptcha, setShowCaptcha] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { data: CaptchaData, refetch: refetchCaptcha } = useGetCaptchaUrlQuery(undefined, { skip: !showCaptcha })

  const [login, { isLoading }] = useLoginMutation()

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    clearErrors()
    login(data).then((res) => {
      if (res.data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        localStorage.setItem(AUTH_TOKEN, res.data.data.token)
        setShowCaptcha(false)
        reset()
      }
      if (res.data?.resultCode === ResultCode.CaptchaError) {
        setShowCaptcha(true)
        refetchCaptcha()
        const captchaError = res.data?.fieldsErrors?.find((e) => e.field === 'captcha')
        if (captchaError) {
          setError('captcha', { message: captchaError.error })
        }
        if (res.data?.messages?.length) {
          setError('root', { message: res.data.messages[0] })
        }
      }
    })
  }

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://social-network.samuraijs.com"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <FormGroup>
            <TextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
            <TextField
              type={showPassword ? 'text' : 'password'}
              label="Password"
              margin="normal"
              error={!!errors.password}
              slotProps={{
                input: {
                  endAdornment:
                    <InputAdornment position="end" >
                      <IconButton onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>,
                },
              }}
              {...register("password")}
            />
            {showCaptcha && (
              <>
                <img src={CaptchaData?.url} />
                <Button type="button" onClick={refetchCaptcha} variant="contained" color="primary">Обновить</Button>
                <TextField
                  type="text"
                  label="Captcha"
                  margin="normal"
                  error={!!errors.captcha}
                  {...register("captcha")}
                />
                {errors.captcha && <span className={styles.errorMessage}>{errors.captcha.message}</span>}
              </>)}
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                />
              }
            />
            {errors.root && <span className={styles.errorMessage}>{errors.root.message}</span>}
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
