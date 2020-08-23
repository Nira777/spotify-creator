let axios = require("axios");
let qs = require("qs");
let tanya = require("readline-sync");
var randomstring = require("randomstring");
let chalk = require("chalk");
const Spotify = (username, password, tgl_lahir, bln_lahir, thn_lahir, email) =>
  new Promise((resolve, reject) => {
    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
    let version_ua_phone = [
      "ASUS_T00F",
      "ASUS_T00J",
      "ASUS_T00Q",
      "ASUS_Z007",
      "ASUS_Z00AD",
      "ASUS_X00HD",
    ];
    let data = qs.stringify({
      iagree: "true",
      birth_day: tgl_lahir,
      birth_month: bln_lahir,
      platform: "Android-ARM",
      creation_point: "client_mobile",
      password: password,
      key: "142b583129b2df829de3656f9eb484e6",
      birth_year: thn_lahir,
      email: email,
      gender: "male",
      app_version: "849800892",
      password_repeat: password,
      username: username,
    });
    let config = {
      method: "post",
      url: "https://spclient.wg.spotify.com:443/signup/public/v1/account/",
      headers: {
        "User-Agent": `Spotify/8.4.98 Android/25 ('${
          version_ua_phone[getRandomInt(version_ua_phone.length)]
        }')`,
        "Content-Type": "application/x-www-form-urlencoded",
        Connection: "Keep-Alive",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.data.status == 1) {
          let json = {
            status: true,
            message: "berhasil",
            result: {
              country: response.data.country,
              username: username,
              password: password,
              email: email,
              ttl: `${tgl_lahir}-${bln_lahir}-${thn_lahir}`,
            },
          };
          resolve(json);
        } else {
          let json = {
            status: false,
            message: "gagal - coba ganti data",
          };
          resolve(json);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });

(async () => {
  let random = tanya.question(`Data Mau Random Semua? (y/n) `);
  let custom_mail;
  let custom_pass;
  let custom_uname;
  let custom_ttl;
  if (random == "n") {
    custom_mail = tanya.question(`Custom Email? (y/n) `);
    custom_uname = tanya.question(`Custom Username? (y/n) `);
    custom_pass = tanya.question(`Custom Password? (y/n) `);
    custom_ttl = tanya.question(`Custom Tanggal Lahir? (y/n) `);
  } else {
    custom_mail = "n";
    custom_pass = "n";
    custom_uname = "n";
    custom_ttl = "n";
  }
  console.log("\n\n");
  let jmlh = tanya.question("Berapa Account? ");
  jmlh = parseInt(jmlh);
  for (let i = 1; i < jmlh + 1; i++) {
    let mail =
      custom_mail == "n"
        ? `${randomstring.generate(5)}@gmail.com`
        : tanya.question(`Emailnya? `);
    let uname =
      custom_uname == "n"
        ? randomstring.generate(7)
        : tanya.question("Username? ");
    let pass =
      custom_pass == "n"
        ? randomstring.generate(8)
        : tanya.question(`Password? `);
    custom_ttl == "y"
      ? console.log(`Masukkan Tanggal Lahir/Bulan Tanpa Angka 0`)
      : console.log(`Proses Membuat Akun. . .`);
    let tgl =
      custom_ttl == "n"
        ? randomstring.generate({
            length: 1,
            charset: "numeric",
          })
        : tanya.question(`Tanggal Lahir? `);
    let bln =
      custom_ttl == "n"
        ? randomstring.generate({
            length: 1,
            charset: "numeric",
          })
        : tanya.question(`Bulan Lahir? `);
    let tahun = custom_ttl == "n" ? 1999 : tanya.question(`Tahun Lahir? `);
    if (mail && uname && pass && tgl && bln && tahun) {
      if (parseInt(tgl) > 31 || parseInt(bln) > 12 || parseInt(tahun) > 2003) {
        console.log(chalk.red(`Tanggal Lahir Kok Gitu?`));
      } else {
        console.log("\n\n");
        let ekse = await Spotify(uname, pass, tgl, bln, tahun, mail);
        if (ekse.status == true) {
          console.log(
            chalk.green(`=========[Spotify-Account]=========
          Country : ${ekse.result.country}
          Username : ${ekse.result.username}
          Password : ${ekse.result.password}
          Email : ${ekse.result.email}
          TTL : ${ekse.result.ttl}
============[TheRevolt]============`)
          );
        } else {
          console.log(
            chalk.red(`Data Sudah Terdaftar, Silahkan Coba Data Lain`)
          );
        }
      }
    } else {
      console.log(chalk.red(`Data Tidak Boleh Kosong`));
    }
  }
})();
