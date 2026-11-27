<script setup>
import { computed, ref } from "vue";
import { ArrowLeft, Eye, EyeOff, Check, ShieldCheck, Layers, Mail } from "lucide-vue-next";

const props = defineProps({ page: { type: String, required: true } });
const emit = defineEmits(["navigate"]);
const signup = computed(() => props.page.startsWith("Sign up"));
const split = computed(() => props.page.endsWith("02"));
const name = ref("");
const email = ref("");
const password = ref("");
const confirmation = ref("");
const showPassword = ref(false);
const submitted = ref(false);
const complete = ref(false);
const reset = ref(false);
const errors = computed(() => {
  const result = {};
  if (signup.value && !reset.value && !name.value.trim()) result.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) result.email = "Enter a valid email address.";
  if (!reset.value) {
    if (password.value.length < 8) result.password = "Use at least 8 characters.";
    if (signup.value && confirmation.value !== password.value) result.confirmation = "Your passwords don’t match.";
  }
  return result;
});
function submit() {
  submitted.value = true;
  if (!Object.keys(errors.value).length) {
    complete.value = true;
    password.value = "";
    confirmation.value = "";
  }
}
function startAgain() {
  complete.value = false;
  submitted.value = false;
  reset.value = false;
}
function toggleReset() {
  reset.value = !reset.value;
  submitted.value = false;
}
</script>

<template>
  <section class="auth-showcase" aria-label="Authentication demo">
    <div class="auth-preview-bar">
      <div><a class="auth-back" href="#Overview" @click.prevent="emit('navigate', 'Overview')"><ArrowLeft :size="16" />Back to dashboard</a><span class="auth-preview-layout">{{ props.page }}</span></div>
      <span>Demo only · No account is created</span>
    </div>
    <div class="auth-stage" :class="{ 'auth-stage-split': split }">
      <aside v-if="split" class="auth-story">
        <div class="auth-brand"><span><Layers :size="20" /></span>HLQuery</div>
        <div class="auth-story-content">
          <span class="auth-story-kicker">A LITTLE LESS BUSY. A LOT MORE POSSIBLE.</span>
          <h2>Your next chapter<br />starts here.</h2>
          <p>Bring your ideas, your people, and your business together. We’ll make room for what’s next.</p>
          <div class="auth-story-art" aria-hidden="true">
            <div class="auth-art-top"><span><Layers :size="16" /> Your business, in sync</span><span class="auth-art-live">Live overview</span></div>
            <div class="auth-art-revenue"><div><small>Total revenue</small><strong>$24,680<span>.00</span></strong></div><span>+18.6%</span></div>
            <div class="auth-art-chart"><i v-for="(height, index) in [28, 42, 35, 57, 46, 67, 56, 78, 65, 89, 82, 100]" :key="index" :style="{ height: height + '%' }"></i></div>
            <div class="auth-art-bottom"><span>This month</span><span>Growing, together.</span></div>
          </div>
          <div class="auth-story-benefits"><span><Check :size="15" /> Thoughtfully designed</span><span><Check :size="15" /> Built around you</span></div>
        </div>
        <p class="auth-story-footer">Good things start with a simple hello.</p>
      </aside>

      <div class="auth-form-panel">
        <div class="auth-form-wrap">
          <div v-if="!split" class="auth-brand"><span><Layers :size="20" /></span>HLQuery</div>
          <template v-if="complete">
            <div class="auth-success" role="status" aria-live="polite">
              <span class="auth-success-icon"><Mail v-if="reset" :size="26" /><Check v-else :size="28" /></span>
              <span class="auth-form-kicker">PREVIEW COMPLETE</span>
              <h1>{{ reset ? 'Recovery preview ready.' : signup ? 'A great first step.' : 'Welcome back.' }}</h1>
              <p>{{ reset ? 'This is how a recovery confirmation would look. No email was sent.' : 'Your form passed validation. This showcase doesn’t create accounts or start a session.' }}</p>
              <button class="auth-submit" type="button" @click="startAgain">Try the form again</button>
              <button class="auth-text-button" type="button" @click="emit('navigate', 'Overview')">Explore the dashboard</button>
            </div>
          </template>
          <template v-else>
            <span class="auth-form-kicker">{{ reset ? 'LET’S GET YOU BACK IN' : signup ? 'SOMETHING GOOD STARTS HERE' : 'YOUR WORKSPACE IS WAITING' }}</span>
            <h1>{{ reset ? 'Forgot your password?' : signup ? 'Create your account' : 'Welcome back' }}</h1>
            <p class="auth-intro">{{ reset ? 'Enter your email to preview the recovery flow.' : signup ? 'A fresh start for your next big idea.' : 'A familiar place. A fresh start to your day.' }}</p>

            <form novalidate @submit.prevent="submit">
              <div v-if="signup && !reset" class="auth-field">
                <label for="auth-name">Full name</label>
                <input id="auth-name" v-model="name" autocomplete="name" placeholder="Alex Morgan" required :aria-invalid="submitted && !!errors.name" :aria-describedby="submitted && errors.name ? 'auth-name-error' : undefined" />
                <p v-if="submitted && errors.name" id="auth-name-error" class="auth-error" role="alert">{{ errors.name }}</p>
              </div>
              <div class="auth-field">
                <label for="auth-email">Email address</label>
                <input id="auth-email" v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required :aria-invalid="submitted && !!errors.email" :aria-describedby="submitted && errors.email ? 'auth-email-error' : undefined" />
                <p v-if="submitted && errors.email" id="auth-email-error" class="auth-error" role="alert">{{ errors.email }}</p>
              </div>
              <template v-if="!reset">
                <div class="auth-field">
                  <div class="auth-label-row"><label for="auth-password">Password</label><button v-if="!signup" type="button" class="auth-text-button" @click="toggleReset">Forgot password?</button></div>
                  <div class="auth-password">
                    <input id="auth-password" v-model="password" :type="showPassword ? 'text' : 'password'" :autocomplete="signup ? 'new-password' : 'current-password'" placeholder="At least 8 characters" minlength="8" required :aria-invalid="submitted && !!errors.password" :aria-describedby="submitted && errors.password ? 'auth-password-error' : undefined" />
                    <button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'" :aria-pressed="showPassword" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="18" /><Eye v-else :size="18" /></button>
                  </div>
                  <p v-if="submitted && errors.password" id="auth-password-error" class="auth-error" role="alert">{{ errors.password }}</p>
                </div>
                <div v-if="signup" class="auth-field">
                  <label for="auth-confirmation">Confirm password</label>
                  <input id="auth-confirmation" v-model="confirmation" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Re-enter your password" required :aria-invalid="submitted && !!errors.confirmation" :aria-describedby="submitted && errors.confirmation ? 'auth-confirmation-error' : undefined" />
                  <p v-if="submitted && errors.confirmation" id="auth-confirmation-error" class="auth-error" role="alert">{{ errors.confirmation }}</p>
                </div>
              </template>
              <button class="auth-submit" type="submit">{{ reset ? 'Preview password recovery' : signup ? 'Create account' : 'Sign in' }}</button>
            </form>
            <div class="auth-demo-note"><ShieldCheck :size="16" /><span>Try it with sample details. Nothing is sent or saved.</span></div>
            <p class="auth-switch" v-if="reset"><button type="button" class="auth-text-button" @click="toggleReset">Back to sign in</button></p>
            <p class="auth-switch" v-else>
              <span>{{ signup ? 'Already have an account?' : 'New to HLQuery?' }}</span>
              <a :href="`#${signup ? 'Login' : 'Sign up'} ${split ? '02' : '01'}`" @click.prevent="emit('navigate', `${signup ? 'Login' : 'Sign up'} ${split ? '02' : '01'}`)">{{ signup ? 'Sign in' : 'Create a business account' }}</a>
            </p>
          </template>
        </div>
        <span class="auth-panel-footer">Designed with care. Built by HLQuery.</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-showcase { display: flex; flex-direction: column; min-height: 100dvh; background: var(--surface); color: var(--text); }
.auth-back { display: inline-flex; align-items: center; gap: 8px; color: var(--text); font-weight: 600; }
.auth-back:hover { color: var(--primary); }
.auth-showcase > .auth-stage { flex: 1; display: grid; }
.auth-stage:not(.auth-stage-split) { align-items: center; }
.auth-preview-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 15px 20px; border-bottom: 1px solid var(--line); font-size: 12px; color: var(--muted); }
.auth-preview-bar > div { display: flex; align-items: center; gap: 9px; }
.auth-preview-bar strong { color: var(--text); font-weight: 600; }
.auth-preview-dot { width: 7px; height: 7px; border-radius: 50%; background: #32856e; }
.auth-preview-layout { padding-left: 12px; border-left: 1px solid var(--line); }
.auth-stage { padding: 50px 24px; background: radial-gradient(ellipse at 50% 0, #1976d30c, transparent 70%), var(--canvas); }
.auth-form-panel { position: relative; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 36px; width: min(100%, 490px); padding: 36px 42px 24px; margin: auto; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); box-shadow: 0 14px 40px #153b5e06; }
.auth-form-wrap { width: 100%; }
.auth-brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 750; letter-spacing: -.04em; margin-bottom: 34px; }
.auth-brand > span:first-child { display: grid; place-items: center; width: 36px; height: 36px; background: #1976d3; border-radius: 10px; color: #fff; }
.auth-form-kicker { display: block; color: var(--muted); font-size: 11px; font-weight: 650; letter-spacing: .11em; margin-bottom: 10px; }
.auth-form-wrap h1 { font-size: clamp(25px, 2.4vw, 32px); line-height: 1.2; font-weight: 650; letter-spacing: -.045em; margin: 0 0 10px; }
.auth-intro, .auth-success p { color: var(--muted); font-size: 14px; line-height: 1.7; margin: 0 0 28px; }
.auth-field { margin-bottom: 19px; }
.auth-field label { display: block; color: var(--text); font-size: 14px; font-weight: 550; margin-bottom: 8px; }
.auth-field input { display: block; width: 100%; height: 46px; border: 1px solid var(--line); border-radius: 8px; padding: 0 13px; background: var(--surface); color: var(--text); font: inherit; font-size: 14px; outline: none; }
.auth-field input::placeholder { color: var(--muted); opacity: .85; }
.auth-field input:focus { border-color: #1976d3; box-shadow: 0 0 0 3px #1976d318; }
.auth-field input[aria-invalid="true"] { border-color: #cf4655; }
.auth-label-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.auth-text-button, .auth-switch a { border: 0; background: none; padding: 0; color: #1976d3; cursor: pointer; font: inherit; font-size: 14px; text-decoration: none; }
.auth-text-button:hover, .auth-switch a:hover { text-decoration: underline; }
.auth-label-row .auth-text-button { font-size: 12px; }
.auth-password { position: relative; }
.auth-password input { padding-right: 46px; }
.auth-password > button { position: absolute; display: grid; place-items: center; right: 3px; top: 3px; width: 40px; height: 40px; border: 0; background: none; color: var(--muted); cursor: pointer; border-radius: 6px; }
.auth-submit { width: 100%; min-height: 46px; padding: 12px; background: #1976d3; color: #fff; border: 0; border-radius: 8px; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: background .15s; }
.auth-submit:hover { background: #125da9; }
.auth-switch { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; font-size: 14px; margin: 24px 0 0; color: var(--muted); }
.auth-switch a { font-weight: 600; }
.auth-demo-note { display: flex; align-items: flex-start; justify-content: center; gap: 7px; border-top: 1px solid var(--line); margin-top: 24px; padding-top: 20px; color: var(--muted); font-size: 12px; line-height: 1.6; }
.auth-demo-note svg { flex-shrink: 0; margin-top: 1px; }
.auth-panel-footer { color: var(--muted); font-size: 11px; text-align: center; }
.auth-error { margin: 6px 0 0; color: #cf4655; font-size: 12px; line-height: 1.5; }
.auth-success { text-align: center; padding: 35px 0; }
.auth-success-icon { display: grid; place-items: center; margin: 0 auto 25px; width: 60px; height: 60px; border-radius: 50%; color: #28836d; background: #28836d18; }
.auth-success .auth-text-button { margin-top: 20px; }
.auth-stage-split { display: grid; grid-template-columns: 1fr 1fr; padding: 0; min-height: 690px; background: var(--surface); }
.auth-stage-split .auth-form-panel { width: 100%; max-width: 520px; height: 100%; padding: 50px 40px 24px; border: 0; border-radius: 0; box-shadow: none; justify-content: space-between; }
.auth-stage-split .auth-form-wrap { margin: auto 0; padding: 20px 0; }
.auth-story { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 32px; color: #fff; overflow: hidden; background: radial-gradient(ellipse at 0% 100%, #246e9f 0, transparent 65%), radial-gradient(ellipse at 100% 0, #225683, transparent 70%), #102d4d; }
.auth-story .auth-brand > span:first-child { background: #ffffff18; }
.auth-brand-label { margin-left: auto; font-size: 10px; font-weight: 500; letter-spacing: .12em; color: #b7d5eb; }
.auth-story-content { position: relative; padding: 20px 0 28px; max-width: 420px; margin: auto; }
.auth-story-kicker { color: #a9cfe6; font-size: 10px; font-weight: 600; letter-spacing: .1em; }
.auth-story h2 { font-size: clamp(30px, 3.3vw, 46px); font-weight: 550; line-height: 1.12; letter-spacing: -.045em; margin: 18px 0; }
.auth-story-content > p { font-size: 14px; line-height: 1.8; color: #bed0e0; max-width: 340px; }
.auth-story-art { border: 1px solid #ffffff24; border-radius: 12px; background: #ffffff09; padding: 20px; margin-top: 30px; box-shadow: 0 20px 50px #071c3e25; transform: rotate(-3deg); }
.auth-art-top, .auth-art-revenue, .auth-art-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.auth-art-top { padding-bottom: 17px; border-bottom: 1px solid #ffffff18; font-size: 11px; }
.auth-art-top > span:first-child { display: flex; align-items: center; gap: 7px; }
.auth-art-live { color: #a9dfcd; font-size: 9px; }
.auth-art-revenue { margin-top: 20px; }
.auth-art-revenue small { display: block; color: #aac3d9; font-size: 10px; margin-bottom: 6px; }
.auth-art-revenue strong { font-size: 29px; letter-spacing: -.04em; font-weight: 550; }
.auth-art-revenue strong span { color: #aac3d9; }
.auth-art-revenue > span { color: #b3ebd7; background: #84d5b31a; border-radius: 5px; padding: 5px 8px; font-size: 10px; }
.auth-art-chart { height: 95px; display: flex; align-items: flex-end; gap: 7px; margin-top: 20px; border-bottom: 1px solid #ffffff25; }
.auth-art-chart i { flex: 1; background: linear-gradient(#81c6f8, #81c6f820); border-radius: 4px 4px 0 0; }
.auth-art-chart i:nth-child(-n+7) { opacity: .55; }
.auth-art-bottom { margin-top: 12px; color: #b2cadd; font-size: 9px; }
.auth-story-benefits { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 32px; color: #c4dce9; font-size: 11px; }
.auth-story-benefits > span { display: flex; align-items: center; gap: 5px; }
.auth-story-footer { color: #9fbcd1; font-size: 11px; margin: 0; }
.auth-showcase :is(button, a):focus-visible { outline: 2px solid #56a6ed; outline-offset: 4px; }
:global(.commerce.dark) .auth-text-button, :global(.commerce.dark) .auth-switch a { color: #83c4ff; }
:global(.commerce.dark) .auth-error { color: #ff9aa6; }
@media (max-width: 1100px) { .auth-story { padding: 26px; } .auth-stage-split .auth-form-panel { padding: 36px 26px 24px; } .auth-story-benefits { gap: 10px; } }
@media (max-width: 800px) { .auth-stage-split { grid-template-columns: 1fr; min-height: 0; } .auth-story-content { max-width: none; margin: 0; padding: 10px 0; } .auth-story h2 { font-size: 32px; } .auth-story-art, .auth-story-benefits, .auth-story-footer { display: none; } .auth-story .auth-brand { margin-bottom: 12px; } .auth-story-content > p { max-width: none; } .auth-story h2 br { display: none; } .auth-preview-bar { align-items: flex-start; flex-direction: column; gap: 7px; } }
@media (max-width: 480px) { .auth-stage { padding: 20px 12px; } .auth-stage-split { padding: 0; } .auth-form-panel { padding: 28px 20px 20px; } .auth-stage-split .auth-form-panel { padding: 28px 20px 20px; } .auth-preview-bar { padding: 14px; } .auth-preview-layout { font-size: 11px; } }
</style>
