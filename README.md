# 🎓 DCRandom – Ôn thi thông minh

> Luyện tập câu hỏi đề cương **ngẫu nhiên**, ôn thi hiệu quả hơn mỗi ngày.

🔗 **Live:** [dcrandom.vercel.app](https://dcrandom.vercel.app)  
📦 **Repo:** [github.com/minhquan-ai/dcrandom](https://github.com/minhquan-ai/dcrandom)

---

## ✨ Tính năng

- 📚 **Nhiều môn học** – hiện hỗ trợ Lịch Sử 11 & Sinh Học 11
- 🔀 **Câu hỏi ngẫu nhiên** – xáo trộn mỗi lần bắt đầu, không bao giờ nhàm chán
- 4 dạng câu hỏi:
  - ✅ Trắc nghiệm nhiều lựa chọn (A/B/C/D)
  - ☑️ Trắc nghiệm Đúng / Sai
  - 📝 Trả lời ngắn
  - 📖 Tự luận (có đáp án tham khảo)
- 📊 **Bảng kết quả** sau khi nộp bài – xem đúng/sai từng câu
- 💡 **Giải thích đáp án** cho câu Đúng/Sai và trả lời ngắn
- 📱 Giao diện **responsive** – dùng được trên điện thoại lẫn máy tính

---

## 🛠️ Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| [Next.js 16](https://nextjs.org/) | Framework chính (App Router + Turbopack) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI components |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [Vercel](https://vercel.com/) | Hosting & Deploy |

---

## 🚀 Chạy local

```bash
# Clone repo
git clone https://github.com/minhquan-ai/dcrandom.git
cd dcrandom

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

---

## 📂 Cấu trúc thư mục

```
dcrandom/
├── app/
│   ├── layout.tsx        # Root layout, metadata
│   ├── page.tsx          # Trang chính
│   └── globals.css       # Global styles
├── components/
│   ├── quiz-app.tsx      # Component chính của ứng dụng
│   └── ui/               # shadcn/ui components
├── data/
│   ├── history.json      # Câu hỏi Lịch Sử 11
│   └── biology.json      # Câu hỏi Sinh Học 11
└── lib/
    └── utils.ts
```

---

## ➕ Thêm môn học mới

1. Tạo file JSON mới trong thư mục `data/` theo cấu trúc:

```json
{
  "multipleChoice": [
    {
      "id": "mc1",
      "question": "Câu hỏi của bạn?",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": 0
    }
  ],
  "trueFalse": [...],
  "shortAnswer": [...],
  "essay": [...]
}
```

2. Import và đăng ký trong `components/quiz-app.tsx`:

```ts
import newSubjectData from "@/data/ten-mon.json";

const quizDataMap = {
  history: historyDataRaw,
  biology: biologyDataRaw,
  tenmon: newSubjectData,   // ← thêm vào đây
};
```

3. Thêm option vào dropdown chọn môn trong phần `<SelectContent>`.

---

## 👤 Tác giả

Made with ❤️ by **[minhquan-ai](https://github.com/minhquan-ai)**

---

## 📄 License

MIT – thoải mái dùng, sửa và chia sẻ!
