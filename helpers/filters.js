export async function isLoggedIn (model, next, redirect) {
  const userId = model.scope().get('_session.userId')
  const $user = model.scope('users.' + userId)
  await $user.fetchAsync()
  const user = $user.get()

  if (!user) return redirect('/auth')
  next()
}

export async function isNotLoggedIn (model, next, redirect) {
  const userId = model.scope().get('_session.userId')
  const $user = model.scope('users.' + userId)
  await $user.fetchAsync()
  const user = $user.get()

  if (user) return redirect('/')
  next()
}

