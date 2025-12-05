#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键启动 Pixel Cabin 项目
同时启动前端开发服务器和后端服务器
"""

import os
import sys
import subprocess
import signal
import time
from threading import Thread
from pathlib import Path

class Colors:
    """终端输出颜色"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_colored(text, color=Colors.OKGREEN):
    """打印彩色文本"""
    print(f"{color}{text}{Colors.ENDC}")

def is_windows():
    """检查是否为Windows系统"""
    return os.name == 'nt'

def check_node():
    """检查Node.js是否已安装"""
    try:
        subprocess.run(['node', '--version'], 
                      stdout=subprocess.PIPE, 
                      stderr=subprocess.PIPE, 
                      check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_dependencies(project_root):
    """检查并安装依赖"""
    client_dir = os.path.join(project_root, 'client')
    server_dir = os.path.join(project_root, 'server')
    
    # 检查客户端依赖
    if not os.path.exists(os.path.join(client_dir, 'node_modules')):
        print_colored("正在安装客户端依赖...", Colors.OKBLUE)
        subprocess.run(['npm', 'install'], cwd=client_dir, check=True)
    
    # 检查服务端依赖
    if not os.path.exists(os.path.join(server_dir, 'node_modules')):
        print_colored("正在安装服务端依赖...", Colors.OKBLUE)
        subprocess.run(['npm', 'install'], cwd=server_dir, check=True)

def start_server(project_root):
    """启动后端服务器"""
    server_dir = os.path.join(project_root, 'server')
    print_colored("启动后端服务器...", Colors.OKBLUE)
    
    # 使用适当的命令启动服务器
    cmd = ['npm', 'run', 'dev']
    if is_windows():
        # Windows下使用start命令在新窗口中启动
        subprocess.Popen(['start', 'cmd', '/k', 'npm run dev'], 
                        cwd=server_dir, 
                        shell=True)
    else:
        # Linux/Mac下在后台启动
        subprocess.Popen(cmd, cwd=server_dir)
    
    # 等待服务器启动
    time.sleep(3)
    return True

def start_client(project_root):
    """启动前端客户端"""
    client_dir = os.path.join(project_root, 'client')
    print_colored("启动前端客户端...", Colors.OKBLUE)
    
    # 启动客户端开发服务器
    cmd = ['npm', 'run', 'dev']
    if is_windows():
        # Windows下在新窗口启动
        subprocess.Popen(['start', 'cmd', '/k', 'npm run dev'], 
                        cwd=client_dir, 
                        shell=True)
    else:
        # Linux/Mac下直接启动
        subprocess.Popen(cmd, cwd=client_dir)
    
    return True

def print_banner():
    """打印启动横幅"""
    banner = """
╔════════════════════════════════════════╗
║         Pixel Cabin 项目启动器          ║
║                                        ║
║  一键启动前端和后端开发服务器           ║
║                                        ║
║  前端: http://localhost:5173           ║
║  后端: http://localhost:2567           ║
╚════════════════════════════════════════╝
"""
    print_colored(banner, Colors.HEADER)

def print_info():
    """打印项目信息"""
    info = """
项目信息:
- 这是一个多游戏小屋项目，使用 Colyseus 框架实现多人在线功能
- 客户端使用 Phaser 游戏引擎开发
- 前端开发服务器通常在 http://localhost:5173 运行
- 后端服务器通常在 http://localhost:2567 运行

停止服务器:
- 关闭相应的终端窗口或按 Ctrl+C 停止服务器
    """
    print_colored(info, Colors.OKCYAN)

def main():
    """主函数"""
    # 获取项目根目录
    project_root = Path(__file__).parent.absolute()
    
    # 打印横幅
    print_banner()
    
    # 检查Node.js
    if not check_node():
        print_colored("错误: 未检测到Node.js，请先安装Node.js", Colors.FAIL)
        print_colored("下载地址: https://nodejs.org/", Colors.WARNING)
        sys.exit(1)
    
    # 检查并安装依赖
    print_colored("检查项目依赖...", Colors.OKBLUE)
    check_dependencies(project_root)
    
    # 启动服务器
    if not start_server(project_root):
        print_colored("启动后端服务器失败", Colors.FAIL)
        sys.exit(1)
    
    # 启动客户端
    if not start_client(project_root):
        print_colored("启动前端客户端失败", Colors.FAIL)
        sys.exit(1)
    
    # 打印信息
    print_colored("\n✅ 前端和后端服务器已成功启动！", Colors.OKGREEN)
    print_info()
    
    # 提示用户如何停止服务器
    if is_windows():
        print_colored("\n要停止服务器，请关闭相应的终端窗口", Colors.WARNING)
    else:
        print_colored("\n要停止服务器，请按 Ctrl+C", Colors.WARNING)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print_colored("\n\n已收到中断信号，正在退出...", Colors.WARNING)
        sys.exit(0)
    except Exception as e:
        print_colored(f"\n发生错误: {e}", Colors.FAIL)
        sys.exit(1)