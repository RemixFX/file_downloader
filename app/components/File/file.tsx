import Image from 'next/image'
import styles from './file.module.css'
import newFile from '@/public/file.png'
import ProgressBar from '../ProgressBar/progress-bar';
import { FilesToUpload } from '@/app/page';

export default function File({ file }: { file: FilesToUpload }) {

  function getLastPart() {
    let index = file.file.name.lastIndexOf('.');
    if(index < 0) {
      return '?'
    }
    return file.file.name.slice(index + 1);
  }

  return (
    <li className={styles.file}>
      <div className={styles.layout}>
        <Image src={newFile} placeholder="blur" alt={file.file.name}></Image>
        <span className={styles.span}>{getLastPart()}</span>
      </div>
      <p className={styles.description}>{file.file.name}</p>
      <p className={styles.description}>{file.file.type}</p>
      <ProgressBar status={file.status}/>
    </li>
  )
}