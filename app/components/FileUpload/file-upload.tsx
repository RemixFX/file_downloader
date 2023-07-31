"use client"

import { ChangeEvent } from 'react'
import styles from './file-upload.module.css'

export default function FileUpload({addFile}: {addFile: (files: File[]) => void}) {

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList = e.target.files!
    const newFilesArray: File[] = Array.from(fileList)
    addFile(newFilesArray)
  } 

  return (
    <div className={styles.container}>
      <label className={styles.button} htmlFor='input'>+</label>
      <input id='input' type="file" onChange={(e) => handleFileChange(e)} multiple style={{ display: 'none' }} />
      <p className={styles.description}>Выберите один или несколько файлов</p>
    </div>
  )
}
