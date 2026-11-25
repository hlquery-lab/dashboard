<script setup>
defineProps({ product: { type: Object, required: true } });
</script>
<template>
  <span
    class="product-art"
    :style="{ '--product-color': product.color || '#a8b9ba' }"
    aria-hidden="true"
  >
    <svg viewBox="0 0 160 160" fill="none">
      <ellipse
        cx="80"
        cy="136"
        rx="42"
        ry="7"
        fill="currentColor"
        opacity=".1"
      />
      <g v-if="product.art === 'bag'" stroke-linejoin="round">
        <path d="M47 55h66l10 75H37z" fill="var(--product-color)" />
        <path
          d="M63 60V42a17 17 0 0 1 34 0v18"
          stroke="#7c6856"
          stroke-width="6"
        />
        <path
          d="M47 55l10 75M113 55l-10 75"
          stroke="#fff"
          opacity=".3"
          stroke-width="3"
        />
        <path d="M67 91h26v19H67z" fill="#f6eee4" />
        <path d="M74 98h12M74 103h9" stroke="#8f7e6a" stroke-width="2" />
      </g>
      <g v-else-if="product.art === 'headphones'">
        <path
          d="M41 94V68a39 39 0 0 1 78 0v26"
          stroke="#354558"
          stroke-width="14"
        />
        <path
          d="M42 66a38 38 0 0 1 76 0"
          stroke="var(--product-color)"
          stroke-width="10"
        />
        <rect
          x="29"
          y="78"
          width="29"
          height="49"
          rx="13"
          fill="var(--product-color)"
        />
        <rect
          x="102"
          y="78"
          width="29"
          height="49"
          rx="13"
          fill="var(--product-color)"
        />
        <rect x="48" y="82" width="12" height="42" rx="5" fill="#354558" />
        <rect x="100" y="82" width="12" height="42" rx="5" fill="#354558" />
      </g>
      <g v-else-if="product.art === 'mug'">
        <path
          d="M105 67h12a20 20 0 0 1 0 40h-12"
          stroke="var(--product-color)"
          stroke-width="12"
        />
        <path
          d="M42 58h66v53a22 22 0 0 1-22 22H64a22 22 0 0 1-22-22z"
          fill="var(--product-color)"
        />
        <ellipse cx="75" cy="58" rx="33" ry="8" fill="#e4c5b2" />
        <ellipse cx="75" cy="58" rx="27" ry="5" fill="#735345" />
        <path
          d="M52 72v33"
          stroke="#fff"
          stroke-width="4"
          opacity=".25"
          stroke-linecap="round"
        />
      </g>
      <g v-else-if="product.art === 'shirt'">
        <path
          d="M58 34L28 52l15 29 14-7v60h46V74l14 7 15-29-30-18c-8 12-36 12-44 0z"
          fill="var(--product-color)"
        />
        <path
          d="M58 34c3 23 41 23 44 0"
          stroke="#fff"
          stroke-width="4"
          opacity=".4"
        />
        <path d="M64 123h32" stroke="#fff" opacity=".25" stroke-width="2" />
      </g>
      <g v-else-if="product.art === 'lamp'">
        <ellipse cx="83" cy="130" rx="33" ry="7" fill="var(--product-color)" />
        <path d="M83 126V79l16-33" stroke="#786b59" stroke-width="6" />
        <path
          d="M62 40c9-17 39-15 47 1l13 28H49z"
          fill="var(--product-color)"
        />
        <ellipse cx="85" cy="69" rx="36" ry="5" fill="#f0dcba" />
        <path
          d="M70 44c6-6 14-8 22-7"
          stroke="#fff"
          opacity=".35"
          stroke-width="3"
          stroke-linecap="round"
        />
      </g>
      <g v-else-if="product.art === 'backpack'">
        <path
          d="M66 37v-5c0-14 28-14 28 0v5"
          stroke="#435e59"
          stroke-width="5"
        />
        <rect
          x="43"
          y="35"
          width="74"
          height="100"
          rx="25"
          fill="var(--product-color)"
        />
        <path d="M46 66h68" stroke="#435e59" stroke-width="2" />
        <rect
          x="55"
          y="83"
          width="50"
          height="37"
          rx="9"
          fill="#fff"
          opacity=".18"
        />
        <path d="M60 91h40" stroke="#435e59" stroke-width="2" />
        <rect x="73" y="48" width="14" height="9" rx="2" fill="#e9e8db" />
      </g>
      <g v-else-if="product.art === 'bottle'">
        <rect x="64" y="25" width="32" height="19" rx="5" fill="#46566a" />
        <path
          d="M63 44h34v14c0 7 9 11 9 22v44c0 7-5 12-12 12H66c-7 0-12-5-12-12V80c0-11 9-15 9-22z"
          fill="var(--product-color)"
        />
        <path
          d="M64 83v39"
          stroke="#fff"
          opacity=".3"
          stroke-width="4"
          stroke-linecap="round"
        />
        <path d="M71 101h18" stroke="#fff" stroke-width="3" opacity=".6" />
      </g>
      <g v-else>
        <path
          d="M37 46q43-15 86 0-10 42 0 78-43-10-86 0 10-40 0-78z"
          fill="var(--product-color)"
        />
        <path
          d="M44 52q36-9 72 0-7 34 0 65-36-6-72 0 7-32 0-65z"
          stroke="#fff"
          opacity=".3"
        />
      </g>
    </svg>
  </span>
</template>
