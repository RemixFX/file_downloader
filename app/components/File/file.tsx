import Image from 'next/image'
import styles from './file.module.css'
import newFile from '@/public/file.png'

export default function File({ file }: { file: File }) {

  function getLastPart() {
    let index = file.name.lastIndexOf('.');
    if(index < 0) {
      return '?'
    }
    return file.name.slice(index + 1);
  }

  return (
    <li className={styles.file}>
      <div className={styles.layout}>
        <Image src={newFile} alt={file.name}></Image>
        <span className={styles.span}>{getLastPart()}</span>
      </div>
      <p className={styles.description}>{file.name}</p>
      <p className={styles.description}>{file.type}</p>
    </li>
  )
}