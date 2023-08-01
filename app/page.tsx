"use client"
import styles from './page.module.css'
import { useCallback, useState } from 'react'
import File from './components/File/file';
import FileUpload from './components/FileUpload/file-upload';


export interface FilesToUpload {
  file: File
  status: string
}

export default function Home() {
  const [files, setFiles] = useState<FilesToUpload[]>([]);
  const addFile = (filesArr: FilesToUpload[]) => {
    if (files) {
      setFiles(files.concat(filesArr))
    }
    else {
      setFiles(filesArr)
    }
  };

  const changeFileStatus = (status: string, i: number) => {
    setFiles((state) => state.map((file, index) => {
      if (index === i) {
        return { ...file, status };
      }
      return file;
    }))
  }

  const createDir = async (name: string) => {
    try {
      const response = await fetch(`https://cloud-api.yandex.net/v1/disk/resources?path=%2F${name}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'OAuth ' + process.env.NEXT_PUBLIC_KEY
        }
      });

      return await response.json();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleUploadClick = async () => {
    if (files.length === 0) {
      return;
    }

    const dirName = new Date().toLocaleString().replaceAll(':', '-');

    try {
      const dirResponse = await createDir(dirName);

      if (dirResponse.message) {
        return console.log(dirResponse.message);
      }

      await Promise.all(files.map(async (file, i) => {
        try {
          changeFileStatus('loading', i);
          const res = await upLoadFile(file.file, dirName);

          if (res.ok) {
            changeFileStatus('completed', i);
            console.log(res.statusText);
          }
        } catch (err: any) {
          changeFileStatus('error', i);
          console.log(err.message);
        }
      }));
    } catch (err) {
      console.log(err);
    }
  };


  const getSizeFiles = useCallback(() => {
    let size = 0;
    files.forEach((file) => {
      size = size + file.file.size
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

  async function upLoadFile(data: File, dirName: string) {
    try {
      const getLink = await fetch(`https://cloud-api.yandex.net/v1/disk/resources/upload?path=%2F${dirName}%2F${data.name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'OAuth ' + process.env.NEXT_PUBLIC_KEY
        }
      });

      if (!getLink.ok) {
        const errorMessage = await getLink.json();
        throw new Error(`Ошибка получения ссылки: ${JSON.stringify(errorMessage)}`);
      }

      const { href } = await getLink.json();
      const uploadResponse = await fetch(href, {
        method: "PUT",
        body: data
      });

      if (!uploadResponse.ok) {
        const errorMessage = await uploadResponse.json();
        throw new Error(`Ошибка загрузки файла: ${JSON.stringify(errorMessage)}`);
      }

      return uploadResponse;
    } catch (err: any) {
      throw new Error(`Ошибка при загрузке файлов: ${err.message}`);
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
            {files.map((file, i) => (
              <File key={i} file={file} />
            ))}
          </ul>
        </div>
      }
    </main>
  )
}
