"use client"

import Image from 'next/image'
import styles from './page.module.css'
import { ChangeEvent, useState } from 'react'

export default function Home() {

  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {

    const fileList: FileList = e.target.files!
    const newFilesArray: File[] = Array.from(fileList)
    if (files) {
      setFiles(files.concat(newFilesArray))
    }
    else {
      setFiles(newFilesArray)
    }
  };

  const handleUploadClick = () => {
    if (!files) {
      return;
    } else {

      const data = new FormData();
      files.forEach((file) => {
        data.append(file.name, file);
      });
    }
  }





  return (
    <main className={styles.main}>
      <div>
        <input type="file" onChange={handleFileChange} multiple />
        <ul>
          {files.map((file, i) => (
            <li key={i}>
              {file.name} - {file.type}
            </li>
          ))}
        </ul>
        <button onClick={handleUploadClick}>Upload</button>
      </div>
    </main>
  )
}
