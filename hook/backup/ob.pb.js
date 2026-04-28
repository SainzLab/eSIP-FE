// onRecordAfterCreateRequest((e) => {
//     const fs = $app.newFilesystem();
//     const recordId = e.record.id;
//     const path = `custom_folder/backup_${recordId}.txt`;
    
//     try {
//         fs.uploadFile(path, `Backup data untuk ID: ${recordId}`);
//         console.log("Berhasil Upload");
//     } catch (err) {
//         console.error("Gagal upload:", err);
//     } finally {
//         fs.close(); 
//     }
// }, "pesanan");