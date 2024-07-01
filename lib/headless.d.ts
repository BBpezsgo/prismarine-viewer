export { }

declare global {
    readonly var THREE: typeof import('three')
    readonly var Worker: import('worker_threads').Worker
}
