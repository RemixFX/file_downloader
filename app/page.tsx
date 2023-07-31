"use client"
import styles from './page.module.css'
import { useCallback, useState } from 'react'
import File from './components/File/file';
import FileUpload from './components/FileUpload/file-upload';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  const addFile = (filesArr: File[]) => {
    if (files) {
      setFiles(files.concat(filesArr))
    }
    else {
      setFiles(filesArr)
    }
  };

  const handleUploadClick = () => {
    if (files.length === 0) {
      return;
    }
    files.forEach((file, i) => {
      upLoadFile(file)
      .then((res) => console.log(res?.statusText))
      .catch((err) => console.log(err.message))
    });
  }

  const getSizeFiles = useCallback(() => {
    let size = 0;
    files.forEach((file) => {
      size = size + file.size
    })
    const Kbytes = size / 1024
    const Mbytes = Kbytes / 1024
    const Gbytes = Mbytes / 1024
    if (Mbytes >= 1000) {
      return Gbytes.toFixed(2) + 'Gb'
    }
    if (Kbytes >= 1000) {
      return Mbytes.toFixed(2) + 'Mb'
    }
    if (Kbytes <= 1000) {
      return Kbytes.toFixed(2) + 'Kb'
    }
  }, [files])

  const PATH = 'Music';

  async function upLoadFile(data: File) {
    try {
      const res = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=%2F${PATH}%2F${data.name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'OAuth ' + process.env.NEXT_PUBLIC_KEY
        }
      })
      if (res.ok) {
        const { href } = await res.json()
        return await fetch(href, {
          method: "PUT",
          body: data
        })
      }
      await res.json().then((message) => Promise.reject(message))
    } catch (err) {
      throw err
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Загрузчик файлов на Яндекс.Диск</h1>
      <FileUpload addFile={addFile} />
      {files.length !== 0 &&
        <div className={styles.container}>
          <div className={styles.summary}>
            <p className={styles.text}>
              Выбрано {files.length} файлов, общим размером: {getSizeFiles()}
            </p>
            <button onClick={handleUploadClick} className={styles.button}>
              загрузить всё
            </button>
          </div>
          <ul className={styles.list}>
            {files.reverse().map((file, i) => (
              <File key={i} file={file} />
            ))}
          </ul>
        </div>
      }
    </main>
  )
}
