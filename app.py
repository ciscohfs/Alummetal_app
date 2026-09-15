from pathlib import Path

from kivy.app import App
from kivy.lang import Builder
from kivy.properties import BooleanProperty, ListProperty, StringProperty
from kivy.uix.screenmanager import Screen
from kivy.core.window import Window

import arabic_reshaper
from bidi.algorithm import get_display


BASE_DIR = Path(__file__).resolve().parent


class AppScreen(Screen):
    pass


class GlassButton(__import__('kivy.uix.button', fromlist=['Button']).Button):
    card_color = ListProperty([0.09, 0.17, 0.24, 1])
    accent = BooleanProperty(False)


class MainApp(App):
    is_english = BooleanProperty(False)
    dark_mode = BooleanProperty(True)
    drawer_open = BooleanProperty(False)
    current_screen = StringProperty('home')
    font_name = StringProperty(str(BASE_DIR / 'Yekan.ttf'))
    result_text = StringProperty('')

    def build(self):
        self.title = 'آلوم متال آراک'
        Window.size = (420, 860)
        Window.minimum_size = (360, 640)
        return Builder.load_file(str(BASE_DIR / 'home.kv'))

    def rtl(self, text):
        return get_display(arabic_reshaper.reshape(text))

    def tr(self, fa, en):
        return en if self.is_english else self.rtl(fa)

    def toggle_language(self):
        self.is_english = not self.is_english
        self.title = 'Alum Metal Arak' if self.is_english else 'آلوم متال آراک'

    def toggle_theme(self):
        self.dark_mode = not self.dark_mode

    def toggle_drawer(self):
        self.drawer_open = not self.drawer_open

    def close_drawer(self):
        self.drawer_open = False

    def show_screen(self, name):
        self.root.ids.manager.current = name
        self.current_screen = name
        self.drawer_open = False

    def calculate_weight(self, length, width, thickness, quantity):
        try:
            length = float(length or 0)
            width = float(width or 0)
            thickness = float(thickness or 0)
            quantity = float(quantity or 1)
            if min(length, width, thickness, quantity) <= 0:
                raise ValueError
            # dimensions in millimeters, density of aluminum in g/cm3
            weight = (length * width * thickness * quantity * 2.70) / 1_000_000
            self.result_text = self.tr('وزن تقریبی: {:.3f} کیلوگرم'.format(weight), 'Estimated weight: {:.3f} kg'.format(weight))
        except (TypeError, ValueError):
            self.result_text = self.tr('لطفاً همه ابعاد را با عدد مثبت وارد کنید.', 'Please enter positive numbers for all dimensions.')

    def submit_quote(self, name, phone, details):
        if name.strip() and phone.strip() and details.strip():
            self.result_text = self.tr('درخواست شما ثبت موقت شد؛ کارشناسان با شما تماس می‌گیرند.', 'Your request was saved locally; our team will contact you.')
        else:
            self.result_text = self.tr('نام، شماره تماس و شرح درخواست را کامل کنید.', 'Please complete your name, phone number and request details.')

    def clear_result(self):
        self.result_text = ''


if __name__ == '__main__':
    MainApp().run()
