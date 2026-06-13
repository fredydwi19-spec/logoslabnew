import { renderSidebar } from './components/sidebar';

export const htmlLayout = (title: string, body: string, role?: string) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | LogosLAB</title>
  
  <!-- Google Fonts: Poppins & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Tailwind Configuration for 60-30-10 Rule -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Poppins', 'sans-serif'],
          },
          colors: {
            navy: '#1A237E',
            gold: '#FFC107',
            orange: {
              DEFAULT: '#FF5722',
              hover: '#E64A19'
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 font-sans text-navy min-h-screen flex flex-col">
  ${role ? renderSidebar(role) : ''}
  <div class="${role ? 'ml-16' : ''} flex-1 flex flex-col transition-all duration-300 ease-in-out">
    ${body}
  </div>
</body>
</html>
`;

