import { useTheme } from 'vuetify'

export default () => {
	return useState(() => useTheme().current.value.dark)
}
