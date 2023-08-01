import styles from './progress-bar.module.css'

export default function ProgressBar({ status }: { status: string }) {

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div className={`
        ${styles.flash}
         ${status === 'loading' && styles.flash_loading}
         ${status === 'completed' && styles.flash_completed}
        `}></div>
        <div className={`
        ${styles.flash}
         ${status === 'loading' && styles.flash_loading}
         ${status === 'completed' && styles.flash_completed}
        `}></div>
        <div className={`
        ${styles.flash}
         ${status === 'loading' && styles.flash_loading}
         ${status === 'completed' && styles.flash_completed}
        `}></div>
      </div>
      <span className={styles.text}>
        {status === 'ready' && 'Готов к загрузке'}
        {status === 'loading' && 'Загрузка...'}
        {status === 'completed' && 'Загружено!'}
        </span>
    </div>
  )
}