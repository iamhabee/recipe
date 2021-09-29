export const getUserAuth = async (auth) => {
  await auth.use('api').check()
  if (auth.use('api').isLoggedIn) {
    const au = auth.use('api').toJSON()
    return au.user
  } else {
    return false
  }
}