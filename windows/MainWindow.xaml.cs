using Microsoft.UI.Xaml;
using System;

namespace GMT.SSS.Windows
{
    public sealed partial class MainWindow : Window
    {
        public MainWindow()
        {
            this.InitializeComponent();
            this.Title = "GMT SSS - Site Security & Surveillance (Windows Native)";

            var webView = new Microsoft.UI.Xaml.Controls.WebView2();
            webView.Source = new Uri(System.IO.Path.Combine(AppContext.BaseDirectory, "dist", "index.html"));
            this.Content = webView;
        }
    }
}
