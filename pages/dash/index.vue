<script setup>
const localePath = useLocalePath()
if (process.client) {
	const token = sessionStorage.getItem("_cransurvey_token")
	const username = sessionStorage.getItem("_cransurvey_usr")
	if (!token || !username) {
		navigateTo(localePath("/sign-in"))
	} else if (!sessionStorage.getItem("_cransurvey_token_lock")) {
		$fetch("/api/usr/token", {
			method: "POST",
			body: JSON.stringify({
				token: token,
			}),
		}).then((rsp) => {
			if (rsp.code == 0) {
				sessionStorage.setItem("_cransurvey_token_lock", true)
			} else {
				sessionStorage.removeItem("_cransurvey_token")
				sessionStorage.removeItem("_cransurvey_usr")
				navigateTo(localePath("/sign-in"))
			}
		})
	}
}
import "~/src/styles/dash.css"
</script>

<template>
	<h1 class="text-h4">{{ $t("dashboard.dashboard") }}</h1>
	<div class="card-group">
		<v-card :title="$t('dashboard.surveys')" :text="ongoingSurveysData" :loading="ongoingLoading" variant="outlined">
			<v-card-actions>
				<v-btn @click="navigateTo(localePath('/dash/surveys'))">{{ $t("dashboard.manage") }}</v-btn>
			</v-card-actions>
		</v-card>
		<v-card :title="$t('dashboard.users')" :text="siteUsersData" :loading="siteUsersLoading" variant="outlined">
			<v-card-actions>
				<v-btn @click="navigateTo(localePath('/dash/users'))">{{ $t("dashboard.manage") }}</v-btn>
			</v-card-actions>
		</v-card>
	</div>
	<!-- <div class="card-group">
		<v-card :title="$t('dashboard.today')" :text="$t('dashboard.today_collected', 1)" variant="tonal">
			<v-card-actions>
				<v-btn>{{ $t("dashboard.manage") }}</v-btn>
			</v-card-actions>
		</v-card>
		<v-card :title="$t('dashboard.this_week')" :text="$t('dashboard.week_collected', 7)" variant="tonal">
			<v-card-actions>
				<v-btn>{{ $t("dashboard.manage") }}</v-btn>
			</v-card-actions>
		</v-card>
	</div> -->
</template>

<script>
export default {
	data() {
		return {
			drawer: true,
			rail: true,
			ongoingLoading: true,
			ongoingSurveysData: "",
			lang: useI18n().locale.value,
			siteUsersLoading: true,
			siteUsersData: "",
		}
	},
	methods: {
		switchLang() {
			navigateTo(useSwitchLocalePath()(this.lang))
		},
	},
	async mounted() {
		const ongoingSurveys = await $fetch("/api/dash/ongoing", {
			method: "POST",
			body: JSON.stringify({
				token: sessionStorage.getItem("_cransurvey_token"),
			}),
		})

		if (ongoingSurveys.code == 0) {
			this.ongoingSurveysData = this.$t("dashboard.ongoing_surveys", ongoingSurveys.count)
		} else {
			this.ongoingSurveysData =
				this.$t("dashboard.error_fetching_data") + " (" + this.$t("error_codes." + ongoingSurveys.code) + ")"
		}

		this.ongoingLoading = false

		const siteUsers = await $fetch("/api/dash/users", {
			method: "POST",
			body: JSON.stringify({
				token: sessionStorage.getItem("_cransurvey_token"),
			}),
		})

		if (siteUsers.code == 0) {
			this.siteUsersData = this.$t("dashboard.site_users", siteUsers.count)
		} else {
			this.siteUsersData =
				this.$t("dashboard.error_fetching_data") + " (" + this.$t("error_codes." + siteUsers.code) + ")"
		}

		this.siteUsersLoading = false
	},
}
</script>
