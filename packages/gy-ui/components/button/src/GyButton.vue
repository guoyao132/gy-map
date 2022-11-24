<template>
  <button
    class="gy-button"
    :class="`
        ${isText ? 'gy-button-text' : ''}
        gy-button-${type} gy-button-${size} ${
            round ? 'gy-button-round' : ''
        }
        ${loading ? 'gy-button-loading' : ''}`"
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
defineProps({
    type: {
        type: String,
        default: 'primary',
    },
    size: {
        type: String,
        default: 'medium',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    round: {
        type: Boolean,
        default: false,
    },
    isText: {
        type: Boolean,
        default: false,
    },
});
</script>

<style lang="less" scoped>
.gy-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    flex-shrink: 0;
    user-select: none;
    width: auto;
    white-space: nowrap;
    transition: all 0.1s;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    box-sizing: border-box;

    svg {
        font-size: 15px;
        width: 20px;
        height: 20px;
    }
}

.gy-button:active {
    transform: scale(0.96);
}
.gy-button-small {
    min-width: 50px;
    height: 24px;
    padding: 0 8px;
    font-size: 12px;
}

.gy-button-medium {
    min-width: 60px;
    height: 30px;
    padding: 0 14px;
    font-size: 14px;
}

.gy-button-large {
    min-width: 70px;
    height: 36px;
    padding: 0 20px;
    font-size: 16px;
}
.gy-button::after {
    position: absolute;
    top: 50%;
    left: 50%;
    content: '';
    border: 2.5px solid rgba(0, 0, 0, 0.25);
    border-left-color: rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    width: 11px;
    height: 11px;
    opacity: 0;
    animation: donut-spin 0.8s linear infinite;
    transition: all 0.15s;
    transform: translate(-50%, -50%);
}
.gy-button-round {
    border-radius: 50px;
}

.gy-button-blank {
    background: none;
    color: rgb(155, 155, 155);
}
.gy-button-blank:hover {
    color: rgb(195, 195, 195);
}
.gy-button-active:hover {
    color: rgb(255, 255, 255);
}
.gy-button-primary {
    background: rgb(50, 86, 136);
    color: rgba(255, 255, 255, 0.9);
}

.gy-button-primary:hover {
    background-color: rgb(54, 109, 187);
}

.gy-button-primary:active {
    background-color: rgb(26, 58, 92);
}

.gy-button-info:hover {
    background-color: rgb(52, 91, 146);
}

.gy-button-info {
    background: rgb(59, 121, 208);
    color:  rgba(255, 255, 255, 0.9);
}

.gy-button-info:active {
    background-color: rgb(42, 94, 149);
}

.gy-button-success {
    background:  rgb(32, 125, 91);
    color: rgba(255, 255, 255, 0.9);
}

.gy-button-success:hover {
    background-color: rgb(40, 176, 126);
}

.gy-button-success:active {
    background-color: rgb(27, 109, 79);
}

.gy-button-error {
    background: rgb(161, 74, 74);
    color: rgba(255, 255, 255, 0.9);
}

.gy-button-error:hover {
    background-color: rgb(231, 113, 113);;
}

.gy-button-error:active {
    background-color: rgb(204, 92, 92);
}

.gy-button-normal {
    background: rgb(84, 81, 81);
    color: rgb(70, 70, 70);
}

.gy-button-normal:hover {
    background-color: rgb(235, 235, 235);;
}

.gy-button-normal:active {
    background-color: rgb(75, 75, 75);
}

.gy-button-warning {
    background: rgb(227, 179, 68);
    color: rgba(255, 255, 255, 0.9);
}

.gy-button-warning:hover {
    background-color: rgb(222, 161, 17);
}

.gy-button-warning:active {
    background-color: rgb(126, 104, 53);
}

@keyframes donut-spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

.gy-button-loading {
    font-size: 0;
}

.gy-button-loading:hover {
    font-size: 0;
}

.gy-button-loading::after {
    opacity: 1;
}

.gy-button[disabled] {
    font-size: 14px;
    cursor: no-drop;
    opacity: 0.5;
}
.gy-button[disabled] {
    background: rgb(84, 81, 81);
    color: #000;
    font-size: 14px;
}
.gy-button[disabled]:hover {
    background: rgb(84, 81, 81);

    font-size: 14px;
}

.gy-button[disabled]::after {
    opacity: 0;
}

.gy-button-text {
    background: none;
    min-width: auto;
    padding: 0 5px;
}
.gy-button-text.gy-button-info {
    color: rgb(33, 83, 153);
}
.gy-button-text.gy-button-primary {
    color:  rgb(75, 126, 198);
}
.gy-button-text.gy-button-error {
    color:  rgb(197, 88, 88);
}
.gy-button-text.gy-button-warning {
    color:  rgb(186, 132, 7);
}
.gy-button-text.gy-button-success {
    color: rgb(35, 153, 110);
}
.gy-button-text.gy-button-normal {
    color: rgb(155, 155, 155);
}
.gy-button-text:hover {
    background: none;
}
.gy-button-text:active {
    background: none;
}
</style>
<style>
.gy-button svg {
    font-size: 15px;
    width: 18px;
    height: 18px;
    margin-right: 5px;
}
</style>
